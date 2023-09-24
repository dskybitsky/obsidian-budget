import { App, Plugin } from 'obsidian';
import type { MarkdownPostProcessorContext, PluginManifest } from 'obsidian';
import { DataviewApi, getAPI as getDataviewApi } from 'obsidian-dataview';
import { createRoot, Root } from 'react-dom/client';
import {
    cloneElement,
    createElement,
    ReactElement,
    ReactNode,
} from 'react';
import { Container, Reader, Writer } from 'skybitsky-common';
import {
    Account,
    Period,
    Category,
    Transaction,
} from './ui';
import { Budget, BudgetInterface } from './services';
import './styles.css';

import {
    SBS_BUDGET_ACCOUNT,
    SBS_BUDGET_CATEGORY,
    SBS_BUDGET_PERIOD,
    SBS_BUDGET_TRANSACTION,
} from './constants';

declare module 'obsidian' {
    interface MetadataCache {
        on(
            name: 'dataview:index-ready',
            callback: () => void,
            ctx?: any,
        ): EventRef;
        on(
            name: 'dataview:metadata-change',
            callback: (type: string, page: any) => void,
            ctx?: any,
        ): EventRef;
    }
}

export default class BudgetPlugin extends Plugin {
    settings: BudgetPluginSettings = DEFAULT_SETTINGS;

    dataviewApi: DataviewApi;

    reader: Reader;

    writer: Writer;

    budget: BudgetInterface;

    readonly rootsIndex: Map<string, Root[]> = new Map();

    readonly elementsFactoriesIndex: Map<Root, () => ReactNode> = new Map();

    readonly renderMode = 'all';

    constructor(app: App, manifest: PluginManifest) {
        super(app, manifest);

        const dataviewApi = getDataviewApi();

        if (!dataviewApi) {
            throw new Error('Dataview Plugin required');
        }

        this.dataviewApi = dataviewApi;

        this.reader = new Reader(this.dataviewApi);
        this.writer = new Writer(app.vault);

        this.budget = new Budget(this.reader, this.writer);
    }

    async onload() {
        await this.loadSettings();

        this.registerMarkdownCodeBlockProcessors();
        this.registerEvents();
    }

    onunload() {
        for (const [, roots] of this.rootsIndex) {
            for (const root of roots) {
                root.unmount();
            }
        }
    }

    async loadSettings() {
        this.settings = {
            ...DEFAULT_SETTINGS,
            ...await this.loadData(),
        };
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    protected registerMarkdownCodeBlockProcessors(): void {
        this.registerMarkdownCodeBlockProcessor(
            SBS_BUDGET_ACCOUNT,
            (_, container, context) => this.processBlock(
                container,
                context,
                createElement(Account, {
                    budget: this.budget,
                    path: context.sourcePath,
                }),
            ),
        );

        this.registerMarkdownCodeBlockProcessor(
            SBS_BUDGET_PERIOD,
            (_, container, context) => this.processBlock(
                container,
                context,
                createElement(Period, {
                    budget: this.budget,
                    path: context.sourcePath,
                }),
            ),
        );

        this.registerMarkdownCodeBlockProcessor(
            SBS_BUDGET_CATEGORY,
            (_, container, context) => this.processBlock(
                container,
                context,
                createElement(Category, {
                    budget: this.budget,
                    path: context.sourcePath,
                }),
            ),
        );

        this.registerMarkdownCodeBlockProcessor(
            SBS_BUDGET_TRANSACTION,
            (_, container, context) => this.processBlock(
                container,
                context,
                createElement(Transaction, {
                    budget: this.budget,
                    path: context.sourcePath,
                }),
            ),
        );
    }

    protected registerEvents(): void {
        this.registerEvent(
            this.app.metadataCache.on(
                'dataview:index-ready',
                this.onDataviewIndexReady,
                this,
            ),
        );

        this.registerEvent(
            this.app.metadataCache.on(
                'dataview:metadata-change',
                this.onDataviewMetadataChange,
                this,
            ),
        );
    }

    protected processBlock(
        container: HTMLElement,
        context: MarkdownPostProcessorContext,
        child: ReactElement,
    ): void {
        const root = createRoot(container);

        this.registerRoot(root, context.sourcePath);

        const elementFactory = () => createElement(Container, {
            loading: !this.dataviewApi.index.initialized,
            className: 'sbs-budget',
        }, cloneElement(child));

        this.elementsFactoriesIndex.set(root, elementFactory);

        root.render(elementFactory());
    }

    protected onDataviewIndexReady() {
        this.renderAllRoots();
    }

    protected onDataviewMetadataChange(_type: string, page: any) {
        if (!page.path) {
            return;
        }

        this.renderRootsByPath(BudgetPlugin.getRootFolder(page.path));
    }

    protected registerRoot(root: Root, path: string) {
        if (!this.rootsIndex.has(path)) {
            this.rootsIndex.set(path, []);
        }

        this.rootsIndex.get(path).push(root);

        const parentPath = BudgetPlugin.getFolder(path);

        if (parentPath !== path) {
            this.registerRoot(root, parentPath);
        }
    }

    protected renderAllRoots(): void {
        for (const [root, elementFactory] of this.elementsFactoriesIndex) {
            root.render(elementFactory());
        }
    }

    protected renderRootsByPath(path: string): void {
        if (!this.rootsIndex.has(path)) {
            return;
        }

        const roots = this.rootsIndex.get(path);

        for (const root of roots) {
            const elementFactory = this.elementsFactoriesIndex.get(root);
            root.render(elementFactory());
        }
    }

    protected static getRootFolder(path: string): string {
        return path.split('/')[0];
    }

    protected static getFolder(path: string): string {
        return path.split('/').slice(0, -1).join('/');
    }
}

interface BudgetPluginSettings {
    rootPath: string;
}

const DEFAULT_SETTINGS: BudgetPluginSettings = {
    rootPath: 'Gaming',
};
