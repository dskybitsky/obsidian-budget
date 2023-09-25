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
} from '../../ui';
import { Budget, BudgetInterface } from '../../services';
import {
    SBS_BUDGET_ACCOUNT,
    SBS_BUDGET_CATEGORY,
    SBS_BUDGET_PERIOD,
    SBS_BUDGET_TRANSACTION,
} from '../constants';
import { PluginInterface, Settings } from '../types';
import { SettingsContext } from '../contexts';
import './Plugin.css';
import { SettingTab } from './SettingTab';

export class Plugin extends ReactPlugin implements PluginInterface {
    settings: Settings = DefaultSettings;

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
        this.addSettingTab(new SettingTab(this.app, this));
    }

    async loadSettings() {
        this.settings = {
            ...DefaultSettings,
            ...await this.loadData(),
        };
    }

    async saveSettings() {
        await this.saveData(this.settings);
        this.renderAllRoots();
    }

    protected registerMarkdownCodeBlockProcessors(): void {
        this.registerMarkdownCodeBlockProcessor(
            CSS.escape(SBS_BUDGET_ACCOUNT),
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
            CSS.escape(SBS_BUDGET_PERIOD),
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
            CSS.escape(SBS_BUDGET_CATEGORY),
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
            CSS.escape(SBS_BUDGET_TRANSACTION),
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

        const containerFactory = () => createElement(SettingsContext.Provider, {
            value: this.settings,
        }, createElement(Container, {
            loading: !this.dataviewApi.index.initialized,
            className: 'sbs-budget',
        }, elementFactory()));

        this.registerElement(root, context.sourcePath, containerFactory);

        root.render(containerFactory());
    }
}

const DefaultSettings: Settings = {
    currency: '',
};
