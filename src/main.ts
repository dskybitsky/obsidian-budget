import { App } from 'obsidian';
import type { MarkdownPostProcessorContext, PluginManifest } from 'obsidian';
import { DataviewApi } from 'obsidian-dataview';
import { createRoot } from 'react-dom/client';
import { createElement, ReactElement } from 'react';
import {
    Container,
    ReactPlugin,
    Reader,
    Writer,
} from 'skybitsky-common';
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

export default class BudgetPlugin extends ReactPlugin {
    settings: BudgetPluginSettings = DEFAULT_SETTINGS;

    dataviewApi: DataviewApi;

    reader: Reader;

    writer: Writer;

    budget: BudgetInterface;

    constructor(app: App, manifest: PluginManifest) {
        super(app, manifest);

        this.reader = new Reader(this.dataviewApi);
        this.writer = new Writer(app.vault);

        this.budget = new Budget(this.reader, this.writer);
    }

    async onload() {
        await this.loadSettings();

        super.onload();

        this.registerMarkdownCodeBlockProcessors();
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
                () => createElement(Account, {
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
                () => createElement(Period, {
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
                () => createElement(Category, {
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
                () => createElement(Transaction, {
                    budget: this.budget,
                    path: context.sourcePath,
                }),
            ),
        );
    }

    protected processBlock(
        container: HTMLElement,
        context: MarkdownPostProcessorContext,
        elementFactory: () => ReactElement,
    ): void {
        const root = createRoot(container);

        const containerFactory = () => createElement(Container, {
            loading: !this.dataviewApi.index.initialized,
            className: 'sbs-budget',
        }, elementFactory());

        this.registerElement(root, context.sourcePath, containerFactory);

        root.render(containerFactory());
    }
}

interface BudgetPluginSettings {
    rootPath: string;
}

const DEFAULT_SETTINGS: BudgetPluginSettings = {
    rootPath: 'Gaming',
};
